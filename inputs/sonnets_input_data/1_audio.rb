require 'open-uri'
require 'nokogiri'

Dir.chdir 'audio'

url = 'https://librivox.org/1121'
html = URI.open(url).read
doc = Nokogiri::HTML(html)
xs = doc.css('a[href$=".mp3"]').map { |link| link['href'] }
xs.reject! { |x| x =~ /64kb/i }

files = xs.map { |x|
  x[/[^\.\/]+\.mp3/]
}

xs.zip(files).each { |x, file|
  system "wget #{x}" unless File.exist? file
}

wavs = files.map { |x|
  x.sub '.mp3', '.wav'
}

files.zip(wavs).each { |mp3, wav|
  next if File.exist? wav
  system "ffmpeg -i #{mp3} -af loudnorm -ar 16000 -ac 1 -c:a pcm_s16le #{wav}" # whisper-ish
}

system 'rm joined.flac'
stuff = ''
wavs.each { |x|
  stuff << "file '#{x}'"
  stuff << "\n"
}
File.write 'list.txt', stuff
cmd = "ffmpeg -f concat -safe 0 -i list.txt -af loudnorm -ar 16000 -c:a pcm_s16le joined.wav"
puts cmd
system cmd

at_exit {
  File.unlink 'list.txt' if File.exist? 'list.txt'
}
