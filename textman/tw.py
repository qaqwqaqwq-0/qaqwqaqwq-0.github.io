from textwrap import wrap

text = 'This \t method wraps the input paragraph such that ' + \
    'each line is at most width characters long in the ' + \
    'paragraph. If the input has some content, it returns a ' + \
    'list of lines as output.'
w = wrap(text)
print(w)