locals {
  project     = "honeyman-spa"
  environment = "prod"

  tags = {
    Project     = local.project
    Environment = local.environment
    Owner       = "Honeyman Enterprises"
    ManagedBy   = "Terraform"
  }

  # Cache TTL settings
  cache_default_ttl = 3600  # 1 hour
  cache_max_ttl     = 86400 # 24 hours
  cache_min_ttl     = 0
}
