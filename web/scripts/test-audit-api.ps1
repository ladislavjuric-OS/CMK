# Test POST /api/audit-requests and show full error body on 500
$uri = "http://localhost:3000/api/audit-requests"
$body = '{"email":"test@example.com","payload":{"note":"test"}}'
try {
  $r = Invoke-RestMethod -Uri $uri -Method POST -ContentType "application/json" -Body $body
  $r | ConvertTo-Json
  Write-Host "OK"
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  $reader.BaseStream.Position = 0
  $responseBody = $reader.ReadToEnd()
  Write-Host "Status:" $status
  Write-Host "Response body:" $responseBody
}
