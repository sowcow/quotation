Dir.chdir 'text'

text = File.read 'source.txt'

start = 'THE SONNETS'
finish = 'Love’s fire heats water, water cools not love.'

start_index = text.index(start)
finish_index = text.rindex(finish)

text = text[start_index..(finish_index + finish.length)]
puts text

text = text.lines.map { |x|
  x.strip
}.join(?\n)

# header
text.sub! start, "# #{start}"

# subheaders
text.gsub!(/\n[MDCLXVI]+\n/) { "\n## #{$&.strip}\n" }

text.gsub! /\n\n\n+/, "\n\n"

File.write 'md.md', text
