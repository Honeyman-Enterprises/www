variable "domain_name" {
  description = "Apex domain name"
  type        = string
  default     = "honeymanenterprises.com"
}

variable "bucket_name" {
  description = "S3 bucket name"
  type        = string
  default     = "com.honeymanenterprises.www"
}

variable "domain_www" {
  description = "WWW subdomain"
  type        = string
  default     = "www.honeymanenterprises.com"
}

# ACM certificate is now created by Terraform in acm.tf
# No need for acm_certificate_arn variable

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "build_dir" {
  description = "Build output directory"
  type        = string
  default     = "dist"
}

variable "enable_logging" {
  description = "Enable CloudFront logging"
  type        = bool
  default     = false
}
