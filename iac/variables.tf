variable "aws_region" {
  description = "AWS region for provider resources."
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Name of the private S3 bucket (must be globally unique)."
  type        = string
  default     = "pizza.conrobb.com"
}

variable "default_root_object" {
  description = "Default root object served by CloudFront."
  type        = string
  default     = "index.html"
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100"
}

variable "tags" {
  description = "Common tags applied to resources."
  type        = map(string)
  default     = {}
}
