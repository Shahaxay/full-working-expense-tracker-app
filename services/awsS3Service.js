const AWS = require('aws-sdk');

const uploadToS3=(data, filename)=>{
    const BUCKET_NAME = 'expense-tracking-app-akshay';

            const bucketS3 = new AWS.S3({
                accessKeyId: process.env.IAM_USER_ACCESS_KEY,
                secretAccessKey: process.env.IAM_USER_SECRET_ACCESS_KEY
            });

            const params = {
                Bucket: BUCKET_NAME,
                Key: filename,
                Body: data,
                ACL: 'public-read'
            };
            console.log(data);
            return new Promise((resolve,reject)=>{
                bucketS3.upload(params, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(result);
                    resolve(result.Location);
                }
            })
        });
}

module.exports={
    uploadToS3
}