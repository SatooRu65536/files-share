mc alias set local http://dev-minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD &&
    if mc ls local/$BUCKET_NAME; then
        echo Bucket $BUCKET_NAME already exists.
    else
        echo Bucket $BUCKET_NAME not found. Creating...
        mc mb local/$BUCKET_NAME
    fi

for policy_file in /minio/policies/*.json; do
    if [ -f "$policy_file" ]; then
        policy_name=$(basename "$policy_file" .json)
        mc admin policy create local $policy_name $policy_file
    fi
done
