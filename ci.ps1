# $ENV:WORKSPACE = "C:\Program Files (x86)\Jenkins\workspace\platform"
Set-Alias -Name PS64 -Value "$env:WINDIR\\sysnative\\windowspowershell\\v1.0\\powershell.exe"
$bitness = ([System.IntPtr]::size * 8)
Write-Output "PowerShell default bitness is $bitness-bit"
PS64 {
    $bitness = ([System.IntPtr]::size * 8)
    Write-Output "PowerShell is running in $bitness-bit"
    # $env:ASPNETCORE_ENVIRONMENT = "Development"
    Import-Module WebAdministration
    Set-Variable DOTNET_SYSTEM_NET_HTTP_USESOCKETSHTTPHANDLER=0
    # Set-Variable HTTP_PROXY=http://127.0.0.1:1080
    # Set-Variable HTTPS_PROXY=http://127.0.0.1:1080
    # git config --global http.proxy http://127.0.0.1:1080
    # git config --global https.proxy http://127.0.0.1:1080
    
    # $pub_test = (git tag -l --contains) -match "v_test_.+" -eq $true;
    
    $changes = (git diff HEAD^ --name-status)
    if (($changes | ? { $_ -match "/Geex.Platform.Server/" -eq $true }).Count -gt 0) {
        # server
        Set-Location $ENV:WORKSPACE"\server\Geex.Platform.Server\"
        dotnet publish .\Geex.Platform.Server.csproj /p:Password=geex123@aliyun /p:PublishProfile=.\Properties\PublishProfiles\platform.api.geexbox.tech.pubxml -o $ENV:Temp\publish\platform.api.geexbox.tech
        # if ($pub_test) {
        #     dotnet publish .\Geex.Platform.Server.csproj /p:Password=GeexData@aliyun /p:PublishProfile=.\Properties\PublishProfiles\platform.api.test.geex.com.pubxml -o $ENV:Temp\publish\platform.api.test.geex.com
        # }
    }
    if (($changes | ? { $_ -match "/Platform.Client/" -eq $true }).Count -gt 0) {
        # client
        Set-Location $ENV:WORKSPACE"\client\platform\Platform.Client\"
        dotnet publish .\Platform.Client.csproj /p:Password=geex123@aliyun /p:PublishProfile=.\Properties\PublishProfiles\platform.geexbox.tech.pubxml /p:Env=dev -o $ENV:Temp\publish\platform.geexbox.tech
        # if ($pub_test) {
        #     dotnet publish .\Platform.Client.csproj /p:Password=GeexData@aliyun /p:PublishProfile=.\Properties\PublishProfiles\platform.test.geex.com.pubxml /p:Env=test -o $ENV:Temp\publish\platform.test.geex.com
        # }
    }
}
