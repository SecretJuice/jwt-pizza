output "s3_bucket_name" {
  description = "Name of the private S3 bucket."
  value       = aws_s3_bucket.private_site_bucket.id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution."
  value       = aws_cloudfront_distribution.s3_distribution.id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}
