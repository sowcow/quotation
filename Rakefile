desc 'build signed.apk, expects $JKS_PASS to be set, could use existing jks.jks in the repo root'
task :apk do
  sh <<~END.strip
    docker build -t my-tauri-android:latest . && \
    docker run \
    -e JKS_PASS \
    -v "$(pwd):/app" \
    my-tauri-android:latest \
    sh -c "\
      deno task tauri android init && rake after_init &&\
      rake have_key &&\
      rake build &&\
      rake sign &&\
      cp src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk ../signed.apk \
    "
  END
end

desc 'push .apk into Android device connected by USB through adb'
task :push do
  sh 'adb install signed.apk'
end

desc 'inspect/interactive access into the last built container version'
task :i do
  exec <<~END.strip
    docker run \
    -e JKS_PASS \
    -v "$(pwd):/app" \
    -it my-tauri-android:latest \
    /bin/bash
    "
  END
end

# static Dockerfile keeps it simple
# not giving a thing for submodules too
#
desc 'generates Dockerfile for registry, builds image'
task :reg_build do
  text = File.read 'Dockerfile'

  prefix = <<~END
    #
    # generated from Dockerfile, uses github as code source
    #
  END

  postfix = <<~END
    RUN git clone --depth=1 https://github.com/sowcow/quotation /whole-app
    RUN mkdir -p /app
    RUN mv /whole-app/tauri_app /app
  END

  text = [prefix, text, postfix] * "\n"

  File.write 'registry.Dockerfile', text

  sh <<~END.strip
    docker build -f registry.Dockerfile -t quotation-build:latest .
  END
end

task :reg_push do
end
