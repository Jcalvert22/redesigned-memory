# Deployment Guide for All-Around Athlete App on Google Cloud

This guide outlines the steps to deploy the All-Around Athlete web application to a Google Cloud Compute Engine virtual machine (VM). The application is a Node.js-based Express server that serves static files and provides API endpoints for Supabase integration.

## Prerequisites

- A Google Cloud Platform (GCP) account with billing enabled.
- Basic knowledge of GCP Console, SSH, and command-line tools.
- The application repository cloned locally or accessible via Git.

## Step 1: Set Up a GCP Compute Engine VM

1. **Create a new VM instance:**
   - Go to the GCP Console: [Compute Engine > VM instances](https://console.cloud.google.com/compute/instances).
   - Click "Create Instance".
   - Choose a name for your VM (e.g., `athlete-app-vm`).
   - Select a region and zone close to your users.
   - Choose an appropriate machine type (e.g., e2-micro for testing, or e2-medium for production).
   - Under "Boot disk", select Ubuntu 18
   - Allow HTTP and HTTPS traffic in the "Firewall" section.
   - Click "Create".

2. **Reserve a static external IP (optional but recommended):**
   - Go to [VPC network > External IP addresses](https://console.cloud.google.com/networking/addresses/list).
   - Click "Reserve Static Address".
   - Attach it to your VM instance.

3. **Set up SSH access:**
   - In the GCP Console, go to your VM instance details.
   - Click "Edit" and ensure "Block project-wide SSH keys" is unchecked.
   - Generate an SSH key pair locally if you don't have one:
     ```
     ssh-keygen -t ed25519
     ```
   - Add your public key to the VM's metadata or use the SSH button in the console.

## Step 2: Configure the VM

1. **SSH into your VM:**
   ```
   ssh -i ~/.ssh/your-private-key username@your-vm-external-ip
   ```

2. **Update the system:**
   ```
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Node.js:**
   - Install Node.js 18 or later (check the app's requirements):
     ```
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```
   - Verify installation:
     ```
     node --version
     npm --version
     ```

4. **Install PM2 (Process Manager):**
   ```
   sudo npm install -g pm2
   ```


## Step 3: Deploy the Application

1. **Clone the repository:**
   ```
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Set environment variables:**
   - Create a `.env` file or set them directly:
     ```
     export SUPABASE_URL="your-supabase-project-url"
     export SUPABASE_ANON_KEY="your-supabase-anon-key"
     ```
   - For production, consider using a more secure method like environment variables in systemd or PM2 ecosystem file.

3. **Install dependencies:**
   ```
   sudo npm ci
   ```

4. **Start the application with PM2:**
   ```
   pm2 start app.mjs --name athlete-app
   pm2 save
   pm2 startup
   ```
   - Follow the instructions from `pm2 startup` to enable PM2 to start on boot.

5. **Configure firewall:**
   - Ensure port 80 is open (for HTTP traffic) on google cloud edit settings.

## Step 3.5: Set Up Reverse Proxy with Nginx

To access the application via the external IP without specifying a port, set up Nginx as a reverse proxy.

1. **Install Nginx:**
   ```
   sudo apt install nginx -y
   ```

2. **Create a site configuration:**
   ```
   sudo nano /etc/nginx/sites-available/athlete-app
   ```
   Add the following content:
   ```
   server {
       listen 80;
       server_name your-vm-external-ip;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Replace `your-vm-external-ip` with your actual external IP address.

3. **Enable the site and disable the default:**
   ```
   sudo ln -s /etc/nginx/sites-available/athlete-app /etc/nginx/sites-enabled/
   sudo unlink /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **(Optional) Bind the app to localhost only:**
   - For added security, edit `app.mjs` to listen only on localhost:
     Change `app.listen(PORT, () => ...)` to `app.listen(PORT, '127.0.0.1', () => ...)`.
   - Restart the app: `pm2 restart athlete-app`.

## Step 4: Verify Deployment

1. **Check if the app is running:**
   ```
   pm2 status
   ```

2. **Access the application:**
   - Open a browser and go to `http://your-vm-external-ip`
   - Test the API endpoint: `http://your-vm-external-ip/api/config`

3. **Monitor logs:**
   ```
   pm2 logs athlete-app
   ```

## Automated Deployment with GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-main-to-gcp.yml`) for automated deployments on pushes to the `main` branch.

### Setup for Automated Deployment:

1. **Generate SSH keys for GitHub:**
   - On your local machine:
     ```
     ssh-keygen -t ed25519
     ```
   - Add the public key to your VM's ssh keys in google cloud settings.

2. **Add secrets to GitHub repository:**
   - Go to your GitHub repo > Settings > Secrets and variables > Actions.
   - Add the following secrets:
     - `SSH_PRIVATE_KEY`: The private SSH key generated above.
     - `SSH_HOST`: Your VM's external IP or domain.
     - `SSH_USER`: The SSH username (e.g., `ubuntu`).

3. **Add variables to GitHub repository:**
   - In the same section, add variables:
     - `APP_DIR`: The absolute path to your app on the VM (e.g., `/home/ubuntu/your-repo-name`).
     - `PM2_NAME`: The PM2 process name (e.g., `athlete-app`).

4. **Trigger deployment:**
   - Push to the `main` branch or manually trigger the workflow.

## Troubleshooting

- **Port issues:** Ensure the firewall allows traffic on port 80 and that Nginx is running.
- **Environment variables:** Double-check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly.
- **PM2 issues:** Use `pm2 restart athlete-app` to restart the app.
- **Logs:** Check PM2 logs with `pm2 logs` and system logs with `journalctl -u pm2-ubuntu`.

## Security Considerations

- Use HTTPS in production (consider using Google Cloud Load Balancer or a reverse proxy like Nginx).
- Regularly update your VM and dependencies.
- Use IAM roles and least privilege access for GCP resources.
- Store sensitive data securely (use GCP Secret Manager for secrets).

## Additional Resources

- [GCP Compute Engine Documentation](https://cloud.google.com/compute/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
