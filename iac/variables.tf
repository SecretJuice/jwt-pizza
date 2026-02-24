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

variable "custom_domain" {
  description = "Primary hostname for CloudFront (for example, app.example.com)."
  type        = string
  default     = "pizza.conrobb.com"
}

variable "additional_aliases" {
  description = "Optional extra hostnames for the CloudFront distribution."
  type        = list(string)
  default     = []
}

variable "subject_alternative_names" {
  description = "Optional SAN entries for the ACM certificate."
  type        = list(string)
  default     = []
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID that hosts the custom domain."
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token with DNS edit permissions."
  type        = string
  sensitive   = true
}

variable "manage_custom_domain_dns" {
  description = "Whether Terraform should create the Cloudflare CNAME to CloudFront."
  type        = bool
  default     = true
}

variable "cloudflare_record_name" {
  description = "DNS record name in Cloudflare (for example, @ or app)."
  type        = string
  default     = "pizza"
}

variable "cloudflare_proxied" {
  description = "Whether the Cloudflare DNS record is proxied. Keep false when CloudFront is the CDN."
  type        = bool
  default     = false
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
