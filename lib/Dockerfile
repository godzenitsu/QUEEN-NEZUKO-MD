# using suhail's docker coz mine have issues



FROM quay.io/suhailtechinfo/suhail-v2

RUN git clone https://github.com/godzenitsu/QUEEN-NEZUKO-MD /root/Maher-Zubair/SIGMA-MD

WORKDIR /root/godzenitsu/QUEEN-NEZUKO-MD

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
