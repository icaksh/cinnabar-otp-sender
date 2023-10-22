FROM node:18 AS base

FROM base AS builder

ADD . /app
WORKDIR /app

run npm install 
# 