$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

$body = @{
    name = "Test User 2"
    email = "nottest@example.com"
    phone_number = "087754567891"
    password = "password123"
    password_confirmation = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8001/api/register" -Method POST -Headers $headers -Body $body
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response: $($reader.ReadToEnd())"
    }
} 