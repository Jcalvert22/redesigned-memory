# File Name: deploy-main-to-gcp.yml
```
 - name: Debug SSH key
        run: |
         echo "Listing ~/.ssh:"
         ls -la ~/.ssh
         echo "Key file size:"
         wc -c ~/.ssh/aaa-deploy-key || echo "Key file missing"
```
## Debug Case Study
This code runs after every push to any branch making it a lightweight, but effective way to overall verify that:

* Secrets are being injected correctly
* Files are created in expected locations
* The SSH key is non-empty and accessible

 It isolates environmental issues before attempting an SSH connection, which makes diagnosing CI/CD failures significantly faster. 

## Target Problems
1. Directory Inspection:
```
ls -la ~/.ssh
``` 
* Confirms whether the .ssh directory exists
* Shows all files inside it
* Verifies that aaa-deploy-key was actually created
* Reveals file permissions (critical for SSH)

2. File Existence + Integrity Check
```
wc -c ~/.ssh/aaa-deploy-key
```
* Outputs the file size in bytes
* Helps determine if the key is: Empty (0 bytes → likely secret injection failure), too small (truncated key), or reasonable size (valid private key)

3. Failure Handling
```
|| echo "Key file missing"
```
* Prevents the workflow from crashing at this step
* Provides a clear, human-readable error message instead
### CI/CD Issues This Uncovers:
* Secret not injected
* Wrong file path
* Key improperly written (newline issues)
* Permissions incorrecct
* Overwritten or truncated key 

### Limitations:
* Does not validate key format (e.g., corrupted PEM structure)
* Does not test SSH connectivity
* Does not confirm correct permissions (beyond visibility)
