# Terraform State Backend Configuration
#
# IMPORTANT: This file configures remote state storage in S3
#
# Initial Setup (First Time Only):
# 1. Comment out this entire file for first deployment
# 2. Run: terraform init && terraform apply
# 3. Manually create S3 bucket for state:
#    aws s3 mb s3://honeyman-terraform-state
#    aws s3api put-bucket-versioning --bucket honeyman-terraform-state --versioning-configuration Status=Enabled
#    aws s3api put-bucket-encryption --bucket honeyman-terraform-state --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
# 4. Create DynamoDB table for state locking:
#    aws dynamodb create-table --table-name honeyman-terraform-locks \
#      --attribute-definitions AttributeName=LockID,AttributeType=S \
#      --key-schema AttributeName=LockID,KeyType=HASH \
#      --billing-mode PAY_PER_REQUEST
# 5. Uncomment this file
# 6. Run: terraform init -migrate-state
#
# After initial setup, this configuration will be active for all future deployments

# terraform {
#   backend "s3" {
#     bucket         = "honeyman-terraform-state"
#     key            = "honeyman-react/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "honeyman-terraform-locks"
#
#     # Optional: Add these for additional security
#     # kms_key_id     = "arn:aws:kms:us-east-1:ACCOUNT_ID:key/KEY_ID"
#     # acl            = "private"
#   }
# }
