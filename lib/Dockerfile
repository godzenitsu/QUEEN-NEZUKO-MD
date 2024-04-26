FROM quay.io/maherzubair/sigma-md:beta
RUN git clone https://github.com/godzenitsu/QUEEN-NEZUKO-MD /root/QUEEN-NEZUKO-MD
WORKDIR /root/QUEEN-NEZUKO-MD/
RUN npm install npm@latest
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
 
