# This setup script installs required (and optional) dependencies
# Node.js (required)
# NPM depenedies (required)
# PM2 Process Manager (optional)
# starts the server using PM2 (optional)

# to setup all basic requirements, run the script with no flag, be sure it has root privileges
# to include the PM2 Process Manager, use the flag --pm2



# enter env variables here (optional)

spacer="\n\n"
divider="========================================================="

section () {
    echo $spacer
    echo $divider
    echo "| $1"
    echo $divider
}


section "setting up Xavier backend"


# check domain registration
section "checking domain registration"
echo "What is the URL of your backend server (this server)?"
read domain
ip="$(dig +short $domain)"
if [ -z "${ip}" ]; then
    echo "Before setting up this server, please register your domain to your server's IP address"
    exit 1
fi
echo "Your domain $domain is pointing to IP address $ip"
echo "Is this correct? (Y) / (N)"
read confirmation
if [ "$confirmation" != "${confirmation#[Yy]}" ] ;then 
    proceed=true
else
    echo "Before setting up this server, please register your domain to your server's IP address"
    exit 1
fi


# update
section "updating the operating system"
apt-get update


# install node.js
section "installing Node.js and NPM"
apt install nodejs -y
apt install npm -y


# downooad Xavier
section "downloading Xavier"
mkdir /opt/xavier
cd /opt/xavier
git init
git remote add origin https://github.com/jefferyabbott/Xavier
git config core.sparseCheckout true
echo "backend" > .git/info/sparse-checkout
git pull origin main


# create .env file
section "setup environment variables"
echo "PORT: "
read port
echo "MongoDB connection string (include username and password)"
echo "example: mongodb+srv://MONGO_USER:MONGO_PASSWORD@MONGO_URL"
read mongoURI
echo "Run in production mode? (Y/N)"
echo "warning, running development mode will enable the GraphiQL browser, exposing data"
read isProduction
if [ "$isProduction" != "${isProduction#[Yy]}" ] ;then
    nodeMode="production"
else
    nodeMode="development"
fi
echo "MDM username (example micromdm)?"
read mdmUsername
echo "MDM secret API token"
read mdmToken
echo "MDM server URL"
read mdmServerURL
echo "URL of the Xavier frontend"
read xavierFrontendURL


# write dotenv file
echo "Generating a random complex JWT secret, you can override this in the .env file if you wish"
jwtSecret=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 20 | head -n 1)

cat > /opt/xavier/backend/.env << EOL
    PORT=$port
    MONGO_URI="$mongoURI/?retryWrites=true&w=majority"
    NODE_ENV=$nodeMode
    MDM_USER=$mdmUsername
    MDM_TOKEN=$mdmToken
    MDM_SERVER_URL=$mdmServerURL
    XAVIER_FRONTEND_SERVER_URL=$xavierFrontendURL
    JWT_SECRET=$jwtSecret    
EOL


# are we using Let's Encrypt?
section "setup TLS/SSL"
echo "Are you setting up TLS for this server? (Y/N)"
echo "If you plan to terminate SSL on a load balancer, select N"
read setupTLS
if [ "$setupTLS" != "${setupTLS#[Yy]}" ] ;then 
    echo "Would you like help configuring Let's Encrypt? (Y/N)"
    read setupLetsEncrypt
    if [ "$setupLetsEncrypt" != "${setupLetsEncrypt#[Yy]}" ] ;then
        section "setting up Let's Encrypt cerficate"
        snap install --classic certbot
        ln -s /snap/bin/certbot /usr/bin/certbot
        certbot certonly --standalone
            # will need to enter some data:
            # email address
            # agree to terms
            # agree or decline sharing your email address with Electronic Frontier Foundation
            # domain name
        # need to capture the 2 file paths
        echo "What is the SSL certificate path? (copy and paste from above)"
        read sslCert
        echo "What is the SSL key path? (copy and paste from above)"
        read sslKey
        #echo "$(cat $FILE)$APPEND" > $FILE
        cat > /opt/xavier/backend/.env < "SSL_CERTIFICATE_FILE=$sslCert"
        cat > /opt/xavier/backend/.env < "SSL_KEY_FILE=$sslKey"
    fi
else
    echo "OK - SSL should be terminated at a load balancer"
fi


# install npm dependencies
section "installing Node dependencies"
cd /opt/xavier/backend
npm install


section "setup PM2 process monitor"
echo "Would you like to install PM2? (Y/N)"
read usePM2
if [ "usePM2" != "${usePM2#[Yy]}" ] ;then
    npm install pm2 -g
    pm2 start server.js
fi

section "FINISHED!"


# generate first user account ???


# restart the server after removing the user account creation line




