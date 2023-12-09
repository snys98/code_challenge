$curDir = Get-Location;
Get-ChildItem -Path .\apps -Directory | ForEach-Object {  
    if ((Test-Path -Path "$($_.FullName)\package.json")) {  
        Set-Location -Path $_.FullName  
        npm i
        Set-Location $curDir;
    }  
}  
