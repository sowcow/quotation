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
