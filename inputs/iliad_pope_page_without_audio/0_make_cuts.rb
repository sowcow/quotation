require 'json'
require 'fileutils'

# Check command-line parameters
if ARGV.size != 1
  puts %|Example usage:> ruby #{File.basename($0)} "~/Libation/Books/The Iliad [B004FUCAMW]/The Iliad [B004FUCAMW].m4b"|
  exit 1
end

audio_file = File.expand_path ARGV[0]
unless File.exist?(audio_file)
  puts "Audio file '#{audio_file}' not found!"
  exit 1
end

# Assume cuts.json is in the same directory as this script
script_dir = File.dirname(__FILE__)
cuts_json_path = File.join(script_dir, "cuts.json")
unless File.exist?(cuts_json_path)
  puts "cuts.json not found in #{script_dir}"
  exit 1
end

# Read and sort the JSON markers by time
markers = JSON.parse(File.read(cuts_json_path)).sort_by { |m| m["t"].to_f }

# Determine the total duration of the audio file using ffprobe
ffprobe_cmd = %Q{ffprobe -i "#{audio_file}" -show_entries format=duration -v quiet -of csv="p=0"}
duration_str = `#{ffprobe_cmd}`.strip
audio_duration = duration_str.to_f
if audio_duration <= 0
  puts "Unable to determine audio duration."
  exit 1
end

puts "Audio duration: #{audio_duration} seconds"

# Create the output directory "cuts" if it doesn't exist
output_dir = File.join(script_dir, "cuts")
FileUtils.mkdir_p(output_dir)

# Iterate through the markers and extract segments
markers.each_with_index do |marker, index|
  start_time = marker["t"].to_f
  # The end time is the time of the next marker, or the end of audio for the last marker.
  end_time = (index + 1 < markers.size) ? markers[index + 1]["t"].to_f : audio_duration
  segment_duration = end_time - start_time

  output_filename = marker["f"]
  output_path = File.join(output_dir, output_filename)

  puts "Cutting segment from #{start_time} to #{end_time} seconds -> #{output_path}"

  # Build the ffmpeg command.
  # We use -ss before the -i for fast seeking, and -t for the segment duration.
  ffmpeg_cmd = %Q{ffmpeg -y -ss #{start_time} -i "#{audio_file}" -t #{segment_duration} -map 0:0 -c:a flac "#{output_path}"}
  print "> "
  puts ffmpeg_cmd
  system(ffmpeg_cmd)
end
