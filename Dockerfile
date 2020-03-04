FROM debian:buster-slim



#### NGINX OPERATIONS
# Installing system packages
RUN apt-get update && apt-get install -y \ 
    nano \
    lsb-base \
    nginx-light



#### APP PRE-STEPS
# Installing system temporary packages
RUN apt-get install -y -qq --force-yes git > /dev/null

# Creating a temporary folder for our app
RUN mkdir -p /tmp/app

# Download the entire project
COPY . /tmp/app/

# Moving app to the right place
RUN cp -r /tmp/app/* /var/www/html
RUN rm -rf /tmp/app



#### APP POST-STEPS
# Deleting system temporary packages
RUN apt-get purge -y -qq --force-yes git > /dev/null

# Cleaning the system
RUN apt-get -y -qq --force-yes autoremove > /dev/null

# Changing permissions of the entire Laravel
RUN chown www-data:www-data -R /var/www/
RUN find /var/www -type f -exec chmod 644 {} \;
RUN find /var/www -type d -exec chmod 755 {} \;



#### FINAL OPERATIONS
COPY docker-files/init.sh /init.sh
RUN chown root:root /init.sh
RUN chmod +x /init.sh
EXPOSE 80 443
CMD /init.sh
