#!/usr/bin/ruby

require 'winrm'

host = ENV['RD_OPTION_HOST'] # assumed to be a FQDN
users = ENV['RD_OPTION_USERS']
group = ENV['RD_OPTION_GROUP']

endpoint = "http://#{host}:5985/wsman"

krb5_realm = 'TLRG.ORG'
winrm = WinRM::WinRMWebService.new(endpoint, :kerberos, :realm => krb5_realm)

# the dupe newlines seem necessary to prevent PowerShell running consecutive lines together
enable_access = <<EOF
$users = "#{users}"
$userlist = $users.split(",")

foreach($user in $userlist){
Add-ADGroupMember -Identity "#{group}" -Member $user
}
EOF

stdout = []
stderr = []

winrm.powershell(enable_access) do |out, err|
  stdout.push out if not out.to_s.empty?
  stdout.push err if not err.to_s.empty?
end

if not stdout.empty? or not stderr.empty? then
  STDOUT.print stdout.join "\n" if not stdout.empty?
  STDOUT.print stderr.join "\n" if not stderr.empty?
  exit 1
end