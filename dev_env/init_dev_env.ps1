Write-Output "please make sure the following conditions are met before executing this script."
Write-Output "1. run as *administrator*"
Write-Output "2. have internet access to winget mirrors"
Write-Output "3. local 80/443 port is not occupied (such as iis)"
Write-Output "this script will instal a dev cert into you local machine and add it to trusted root store, so that you can access https://*.dev.challenge for your local development, you'll need to restart your browser after this script is executed to ensure the cert is loaded."
$continue = Read-Host -Prompt "enter 'y' to continue";
if ($continue -ne "y") {
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

if (-not (Check-Command choco)) {
    $continue = Read-Host -Prompt "choco not installed, enter 'y' to install it, or press any key to exit";
    if ($continue -ne "y") {
        exit
    }
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    Read-Host -Prompt "choco installed, please fully restart current process(vscode or powershell) and run this script again, press any key to exit ";
    exit
}

if (-not (Check-Command node)) {
    $continue = Read-Host -Prompt "nodejs not installed, enter 'y' to install it, or press any key to exit";
    if ($continue -ne "y") {
        exit
    }
    choco install nodejs-lts --version=18.12.1 -y
    echo "nodejs installed";
}

if (-not (Check-Command openssl)) {
    $continue = Read-Host -Prompt "openssl not installed, enter 'y' to install it, or press any key to exit";
    if ($continue -ne "y") {
        exit
    }
    choco install openssl -y
    echo "openssl installed";
}

if (-not (Check-Command docker)) {
    $continue = Read-Host -Prompt "docker not installed, enter 'y' to install it, or press any key to exit";
    if ($continue -ne "y") {
        exit
    }
    choco install docker-desktop -y
    docker version
    Read-Host -Prompt "docker installed, please start docker manually then fully restart current process(vscode or powershell) and run this script again, press any key to exit ";
    exit
}

#region cert
$cert = Get-CCertificate -FriendlyName "dev.challenge" -StoreLocation LocalMachine -StoreName Root
$pwd = ConvertTo-SecureString -String "dev.challenge" -AsPlainText -Force
if ($null -eq $cert) {
    $cert = New-SelfSignedCertificate -CertStoreLocation Cert:\LocalMachine\My -Subject dev.challenge -DnsName dev.challenge, *.api.dev.challenge, *.dev.challenge -FriendlyName "dev.challenge" -NotAfter (Get-Date).AddYears(1000)
    mkdir ./.dev_cert -ErrorAction Ignore
    Export-PfxCertificate -Cert "Cert:\LocalMachine\My\$($cert.Thumbprint)" -FilePath "./.dev_cert/dev.challenge.pfx" -Password $pwd
    openssl pkcs12 -in "./.dev_cert/dev.challenge.pfx" -nodes -out ./.dev_cert/dev.challenge.pem -passin pass:dev.challenge
    Install-CCertificate -Path "./.dev_cert/dev.challenge.pfx" -StoreLocation LocalMachine -StoreName Root -Password $pwd
    docker-compose up setup -d
    docker-compose up -d
}

#endregion
