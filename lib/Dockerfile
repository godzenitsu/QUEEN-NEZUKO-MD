FROM quay.io/godzenitsu/QUEEN-NEZUKO-MD
RUN git clone https://github.com/godzenitsu/QUEEN-NEZUKO-MD /root/godzenitsu
WORKDIR /root/godzenitsu/
RUN npm install npm@latest
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
