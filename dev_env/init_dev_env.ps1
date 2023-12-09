Write-Output "please make sure the following conditions are met before executing this script."
Write-Output "1. run as *administrator*"
Write-Output "2. have internet access to package manager mirrors"
Write-Output "3. local 80/443 port is not occupied (such as iis)"
Write-Output "this script will instal a dev cert into you local machine and add it to trusted root store, so that you can access https://*.dev.challenge for your local development, you'll need to restart your browser after this script is executed to ensure the cert is loaded."
$continue = Read-Host -Prompt "enter 'y' to continue";
if ($continue -notlike "y") {
  exit
}
cd $PSScriptRoot

# register a shared dev server to quick share files if necessary
# if ((Test-Path "Z:")-eq $false) {
#     $dev_user = "dev"
#     $dev_pwd = ConvertTo-SecureString -String "dev" -AsPlainText -Force
#     $dev_cred = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $dev_user, $dev_pwd
#     # New-PSDrive -Name "Z" -Root "\\dev\shared" -Persist -PSProvider "FileSystem" -Credential $cred
# }

#region  tools function
if (-not (Get-Module -ListAvailable -Name "Carbon")) {
  Install-Module -Name 'Carbon' -AllowClobber
}
Import-Module 'Carbon'
function Check-Command($cmdname) {
  return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}
#endregion

#region cert
$cert = Get-CCertificate -FriendlyName "dev.challenge" -StoreLocation LocalMachine -StoreName Root
$pwd = ConvertTo-SecureString -String "dev.challenge" -AsPlainText -Force
if ($null -eq $cert) {
  if (-not (Check-Command openssl)) {
    choco install openssl -y
  }
  $cert = New-SelfSignedCertificate -CertStoreLocation Cert:\LocalMachine\My -Subject dev.challenge -DnsName dev.challenge, *.api.dev.challenge, *.dev.challenge -FriendlyName "dev.challenge" -NotAfter (Get-Date).AddYears(1000)
  mkdir ./.dev_cert -ErrorAction Ignore
  Export-PfxCertificate -Cert "Cert:\LocalMachine\My\$($cert.Thumbprint)" -FilePath "./.dev_cert/dev.challenge.pfx" -Password $pwd
  openssl pkcs12 -in "./.dev_cert/dev.challenge.pfx" -nodes -out ./.dev_cert/dev.challenge.pem -passin pass:dev.challenge
  Install-CCertificate -Path "./.dev_cert/dev.challenge.pfx" -StoreLocation LocalMachine -StoreName Root -Password $pwd
  docker-compose up setup -d
  docker-compose up -d
}

#endregion
