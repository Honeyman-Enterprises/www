# CloudFront Cache Invalidation
# Uncomment and run when you need to invalidate the cache
# Change the trigger value to force a new invalidation

# Option 1: Manual trigger (recommended)
# Change the trigger value to force invalidation
resource "terraform_data" "cloudfront_invalidation_trigger" {
  input = "manual-trigger-v2-phone-update-2025-11-08" # Change this value to trigger invalidation
}

resource "null_resource" "cloudfront_invalidation" {
  triggers = {
    trigger = terraform_data.cloudfront_invalidation_trigger.output
  }

  provisioner "local-exec" {
    command = <<-EOT
      aws cloudfront create-invalidation \
        --distribution-id ${aws_cloudfront_distribution.prod.id} \
        --paths "/*" \
        --region us-east-1
    EOT
  }

  depends_on = [aws_cloudfront_distribution.prod]
}

# Option 2: Alternative using native CloudFront invalidation resource
# Note: This approach has limitations and may not work for all scenarios
# Uncomment if you prefer this method:
#
# resource "aws_cloudfront_invalidation" "prod" {
#   distribution_id = aws_cloudfront_distribution.prod.id
#   paths           = ["/*"]
# }
