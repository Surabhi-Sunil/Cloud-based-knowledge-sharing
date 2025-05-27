provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "notiboard_frontend" {
  bucket = var.bucket_name
  force_destroy = true

  tags = {
    Name        = "NotiBoard Frontend"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_public_access_block" "allow_public_access" {
  bucket = aws_s3_bucket.notiboard_frontend.id

  block_public_acls   = false
  block_public_policy = false
  ignore_public_acls  = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.notiboard_frontend.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_policy" "public_policy" {
  bucket = aws_s3_bucket.notiboard_frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.notiboard_frontend.arn}/*"
      }
    ]
  })
}
