# Demo of Azure Media Services with Azure AD

WORK IN PROGRESS
~~~ bash
prefix=cptdams
location=eastus
az group create -n $prefix -l $location
az storage account create -n $prefix -g $prefix --access-tier Hot
az ams account create -n $prefix -g $prefix --storage-account $prefix -l $location
az ams asset create -a $prefix -n $prefix -g $prefix --alternate-id earth --container $prefix --description "spinning globe"
# exp=$(date -u -d "30 minutes" '+%Y-%m-%dT%H:%M:%SZ')
# az ams asset get-sas-urls --expiry $exp --permission ReadWrite -a $prefix -n $prefix -g $prefix
az storage blob upload --account-name $prefix -c $prefix -f media/earth.mp4 -n $prefix 
az ams streaming-endpoint create --account-name $prefix -n $prefix -g $prefix --scale-units 0
az ams streaming-endpoint start --account-name $prefix -n $prefix -g $prefix
az ams streaming-endpoint stop --account-name $prefix -n $prefix -g $prefix
~~~ 

Start the local node.js web app.
~~~ bash
npm start
startedgeguest http://localhost:3000/
~~~

Test with AMP and jwt.io

JWT content:
~~~ json
{
  "alg": "HS256",
  "typ": "JWT"
}
{"iss":"cptdams","aud":"peter","exp":1657024363,"nbf":1657020703}
~~~
Key, ensure to check the "secret base64 encoded" when adding the base64 encoded key.

You can get exp value as follow on bash:
~~~ bash
date -u -d "30 minutes" +%s 
~~~

AMP
~~~ bash
https://azuremediaplayerdemo.azurewebsites.net/
~~~

Video URL:
- https://cptdams-cptdams-usea.streaming.media.azure.net/6a9e5c88-e779-4b8c-9671-c7be7007172d/earth.ism/manifest(format=m3u8-cmaf,encryption=cbc)


