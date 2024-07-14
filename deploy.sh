#!/bin/bash

# Check if project name argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <project_name>"
    exit 1
fi

PROJECT_NAME="$1"

# Fetch latest changes from remote repository
sudo -u "$PROJECT_NAME" bash -c "cd /home/$PROJECT_NAME/$PROJECT_NAME && git fetch"

# Check if there are new changes
if [[ $(sudo -u "$PROJECT_NAME" bash -c "cd /home/$PROJECT_NAME/$PROJECT_NAME && git rev-list HEAD...origin/main --count") -gt 0 ]]; then
    # Pull changes from the remote repository
    sudo -u "$PROJECT_NAME" bash -c "cd /home/$PROJECT_NAME/$PROJECT_NAME && git pull"

    # Check if git pull was successful
    if [ $? -eq 0 ]; then
        # Restart the service
        sudo systemctl restart "$PROJECT_NAME"
        echo "Service $PROJECT_NAME restarted successfully."
    else
        echo "Error: Git pull failed for $PROJECT_NAME. Check logs for details."
        # Optionally handle error or send notification
    fi
else
    echo "No new changes detected. Skipping git pull and service restart."
fi
