import os
import sys
import traceback
from datetime import datetime, timedelta
import logging

from pyspark.sql import SparkSession
from pyspark.sql.types import *
from pyspark.sql.window import Window
from pyspark.sql import functions as F






#Configure logging

logging.basicConfig(
    level=logging.DEBUG, 
    format='%(asctime)s [%(levelname)s]  %(message)s'
)

logger = logging.getLogger(__name__)


#Minio configuration
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadmin"
MINIO_ENDPOINT = "http://minio:9000"
MINIO_BUCKET = "stock-market-data"

def create_spark_session():
    logger.info("Initializing Spark session with S3 configuration...")
    spark = (SparkSession.builder
             .appName("StockMarketBatchProcessor")
             .config("spark.jars.packages", "org.apache.hadoop:hadoop-aws:3.3.1,com.amazonaws:aws-java-sdk-bundle:1.11.901")
             .getOrCreate())
    
    spark_conf = spark.sparkContext._jsc.hadoopConfiguration()
    spark_conf.set("fs.s3a.access.key", MINIO_ACCESS_KEY)
    spark_conf.set("fs.s3a.secret.key", MINIO_SECRET_KEY)
    spark_conf.set("fs.s3a.endpoint", MINIO_ENDPOINT)
    spark_conf.set("fs.s3a.path.style.access", "true")
    spark_conf.set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    spark_conf.set("fs.s3a.connection.ssl.enabled", "false")
    spark_conf.set("fs.s3a.credentials.provider", "org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider")
    
    spark.sparkContext.setLogLevel("WARN")
    logger.info("Spark session initialized successfully")
    
    return spark
    

def read_data_from_s3(spark, date=None):
    logger.info(" --- Reading data from S3 ---")
    
    if date is None:
        processed_date = datetime.now()
    else:
        processed_date = datetime.strptime(date, "%Y-%m-%d")
        
    year = processed_date.year
    month = processed_date.month
    day = 18
            
    s3_path = f"s3a://{MINIO_BUCKET}/raw/historical/year={year}/month={month:02d}/day={day:02d}/"
            
            
    logger.info(f"Reading data from: {s3_path}")
    
    try:
        df = spark.read.option("header", "true").option("inferSchema", "true").parquet(s3_path)
        df.show(5, truncate = False)
        df.printSchema()
        return df
    except Exception as e:
        logger.error(f"Failed to read from S3 path {s3_path}: {e}")
        return None
    
                
            
def process_stock_data(df):
    logger.info("Processing Historical Stock Data")
    
    if df is None or df.count() == 0:
        logger.info("No data to process")
        return None
    
    try:
        record_count = df.count()
        logger.info(f"Record count:{record_count}")
        
        #Window aggregation stats
        window_day = Window.partitionBy("symbol", "date")
        
        #Calculation of metrics
        
        df = df \
        .withColumn("daily_open", F.first("open").over(window_day)) \
        .withColumn("daily_high", F.max("high").over(window_day)) \
        .withColumn("daily_low", F.min("low").over(window_day)) \
        .withColumn("daily_volume", F.sum("volume").over(window_day)) \
        .withColumn("daily_close", F.last("close").over(window_day))
        
        df = df.withColumn("daily_change", ((F.col("daily_close") - F.col("daily_open")) / F.col("daily_open") * 100))
        
        logger.info("Sample of processed data")
        
        df.select("symbol", "date", "daily_open", "daily_high", "daily_low", "daily_volume", "daily_close", "daily_change").show(5)
        
        return df

    except Exception as e:
        logger.error("Failed to process data")
        
        
def validate_data(df):
    logger.info("Running advanced data quality checks...")

    if df is None:
        raise Exception("DataFrame is None")

    total = df.count()

    if total == 0:
        raise Exception("Empty dataset")

    # =========================
    # 1. BASIC NULL CHECKS
    # =========================
    null_symbols = df.filter(F.col("symbol").isNull()).count()
    null_dates = df.filter(F.col("date").isNull()).count()
    null_prices = df.filter(
        F.col("daily_open").isNull() |
        F.col("daily_close").isNull()
    ).count()

    # =========================
    # 2. INVALID VALUE CHECKS
    # =========================
    negative_prices = df.filter(
        (F.col("daily_open") < 0) |
        (F.col("daily_close") < 0)
    ).count()

    zero_volume = df.filter(F.col("daily_volume") <= 0).count()

    # =========================
    # 3. EXTREME MARKET MOVES
    # =========================
    extreme_moves = df.filter(
        (F.col("daily_change") > 50) |
        (F.col("daily_change") < -50)
    ).count()

    # =========================
    # 4. MISSING MARKET COMPLETENESS (NEW)
    # =========================
    missing_high_low = df.filter(
        F.col("daily_high") < F.col("daily_low")
    ).count()

    # =========================
    # 5. INTRADAY CONSISTENCY CHECK (NEW)
    # =========================
    inconsistent_prices = df.filter(
        (F.col("daily_high") < F.col("daily_open")) |
        (F.col("daily_low") > F.col("daily_close"))
    ).count()

    # =========================
    # 6. DUPLICATE CHECK (NEW)
    # =========================
    duplicates = df.groupBy("symbol", "date").count().filter("count > 1").count()

    # =========================
    # 7. METRICS REPORT
    # =========================
    quality_report = {
        "total_records": total,
        "null_symbols": null_symbols,
        "null_dates": null_dates,
        "null_prices": null_prices,
        "negative_prices": negative_prices,
        "zero_volume": zero_volume,
        "extreme_moves": extreme_moves,
        "missing_high_low": missing_high_low,
        "inconsistent_prices": inconsistent_prices,
        "duplicates": duplicates
    }

    logger.info(f"DATA_QUALITY_REPORT: {quality_report}")

    # =========================
    # 8. THRESHOLDS (GATES)
    # =========================

    if null_symbols / total > 0.01:
        raise Exception("Too many null symbols")

    if null_dates > 0:
        raise Exception("Missing dates detected")

    if negative_prices > 0:
        raise Exception("Negative prices detected")

    if zero_volume / total > 0.05:
        raise Exception("Excessive zero volume")

    if duplicates > 0:
        raise Exception("Duplicate records detected")

    if inconsistent_prices > 0:
        raise Exception("Price logic inconsistency detected")

    logger.info("Data quality validation passed successfully")

    return df
        
        
        
        
def write_to_s3(df, date = None):
    
    logger.info("\n ============ Wrtiting to s3 ============")
    
    if df is None:
        logger.info("No data to save")
        return None
    
    if date is None:
        processed_date = datetime.now().strftime("%Y-%m-%d")
    else:
        processed_date = datetime.strptime(date, "%Y-%m-%d").strftime("%Y-%m-%d")
        
    output_path = f"s3a://{MINIO_BUCKET}/processed/historical/date={processed_date}"
    
    logger.info(f"Writing processed data to: {output_path}")
    
    try:
        df.write.partitionBy("symbol").mode("overwrite").parquet(output_path)
        logger.info(f"Data written to s3: {output_path}")
    except Exception as e:
        logger.error("Failed to write data")


def main():
    """Main function to process historical stock data."""
    logger.info("\n =========================================================")
    logger.info("Starting Spark Batch Processor...")
    logger.info(" =========================================================\n")
    
    date = None
    
    spark = create_spark_session()
    
    try:
        df = read_data_from_s3(spark, date)
        
        if df is not None:
            processed_df = process_stock_data(df)
            
            if processed_df:
                write_to_s3(processed_df)
            else:
                logger.info("Error processing the data")
        
        else:
            logger.error("Failed to read data from S3")
    except Exception as e:
        logger.error(f"Error occured: {str(e)}")
    finally:
        logger.info("\n Stoping Spark session")
        spark.stop()
        logger.info("\n =========================================================")
        logger.info("Stoping Spark Batch Processor...")
        logger.info(" =========================================================\n")
        
if __name__ == "__main__":
    main()
        
        
        
    
    

