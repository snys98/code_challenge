$curDir = Get-Location;
Get-ChildItem -Path .\apps -Directory | ForEach-Object {  
    if (Test-Path -Path "$($_.FullName)\package.json" && -not (Test-Path "$($_.FullName)\node_modules")) {  
        Set-Location -Path $_.FullName  
        .\build.ps1
        Set-Location $curDir;
    }  
}  
