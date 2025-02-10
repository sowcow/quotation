#
# generated from Dockerfile, uses github as code source
#

# - some versions may be arbitrary
# - optimization opportunity by using some ready java image possibly, possibly rust from package too

# Start from a reasonably slim base; Debian or Ubuntu are popular
FROM ubuntu:22.04

# Install dependencies (minimal example)
RUN apt-get update && apt-get install -y \
    curl unzip git ruby-full build-essential libssl-dev \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set Java 17 as the default
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:${PATH}"

# Avoid interactive package installs
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl wget unzip git ruby-full build-essential \
    libssl-dev pkg-config xz-utils \
    ca-certificates openjdk-11-jdk \
    nodejs npm \
  && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------
# Install Rust (nightly)
# ---------------------------------------------------
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | \
    sh -s -- -y --profile minimal \
 && /root/.cargo/bin/rustup default nightly

ENV PATH="/root/.cargo/bin:${PATH}"

# ---------------------------------------------------
# Install Deno
# ---------------------------------------------------
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="${DENO_INSTALL}/bin:${PATH}"

# ---------------------------------------------------
# Install pnpm (requires Node)
# ---------------------------------------------------
RUN npm install -g pnpm

# ---------------------------------------------------
# Install Android SDK command-line tools
# ---------------------------------------------------
ENV ANDROID_HOME=/opt/android-sdk
ENV NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653
ENV PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/33.0.0:${PATH}"

RUN mkdir -p $ANDROID_HOME/cmdline-tools \
 && cd $ANDROID_HOME/cmdline-tools \
 && wget https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O cmdline-tools.zip \
 && unzip cmdline-tools.zip -d . \
 && mv cmdline-tools latest

# Accept licenses + install required SDK packages
RUN yes | sdkmanager --licenses \
 && yes | sdkmanager \
    "platform-tools" \
    "platforms;android-33" \
    "ndk;25.2.9519653" \
    "build-tools;33.0.0" \
    "cmdline-tools;latest"

WORKDIR /app/tauri_app

RUN git clone https://github.com/sowcow/quotation /whole-app
WORKDIR /whole-app
RUN git fetch origin && git reset --hard e40f5609e6e4978406f5aa8498204bcf57059a06
RUN mkdir -p /app
RUN mv /whole-app/tauri_app /app
WORKDIR /app/tauri_app
