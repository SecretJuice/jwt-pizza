terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_s3_bucket" "private_site_bucket" {
  bucket = var.bucket_name
  tags   = var.tags
}

resource "aws_s3_bucket_public_access_block" "private_site_bucket" {
  bucket = aws_s3_bucket.private_site_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "private_site_bucket" {
  bucket = aws_s3_bucket.private_site_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "${var.bucket_name}-oac"
  description                       = "CloudFront OAC for ${var.bucket_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  enabled             = true
  comment             = "Distribution for ${var.bucket_name}"
  default_root_object = var.default_root_object
  price_class         = var.price_class

  origin {
    domain_name              = aws_s3_bucket.private_site_bucket.bucket_regional_domain_name
    origin_id                = "s3-${aws_s3_bucket.private_site_bucket.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${aws_s3_bucket.private_site_bucket.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = var.tags
}

data "aws_iam_policy_document" "allow_cloudfront_read" {
  statement {
    sid    = "AllowCloudFrontReadOnlyAccess"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]
    resources = [
      "${aws_s3_bucket.private_site_bucket.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "allow_cloudfront_read" {
  bucket = aws_s3_bucket.private_site_bucket.id
  policy = data.aws_iam_policy_document.allow_cloudfront_read.json
}
