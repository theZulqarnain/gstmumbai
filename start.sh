#!/bin/sh
pm2 stop gstmumbai
pm2 delete gstmumbai
cd ~/gstmumbai
pm2 start --name "gstmumbai" npm -- start