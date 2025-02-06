@f = 'screenshot.png'
system %'adb exec-out screencap -p > #@f'
system %'convert #@f -gravity North -chop 0x75 -gravity South -chop 0x135 #@f'
