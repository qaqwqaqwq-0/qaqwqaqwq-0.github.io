function text_fmt_format_element()
{
    return document.getElementById('text-fmt-format');
}

function text_fmt_arglist_element()
{
    return document.getElementById('text-fmt-arglist');
}

var textfmt_format_codemirror_editor;
var textfmt_arglist_codemirror_editor;

$(document).ready(() =>
{
    textfmt_format_codemirror_editor = CodeMirror.fromTextArea(
        text_fmt_format_element(), {
            lineNumbers: true,
            matchBrackets: true,
            indentUnit: 4,
        }
    );
    textfmt_format_codemirror_editor.setSize('100%', '100%');
    textfmt_arglist_codemirror_editor = CodeMirror.fromTextArea(
        text_fmt_arglist_element(), {
            lineNumbers: true,
            matchBrackets: true,
            indentUnit: 4,
            mode: "javascript",
        }
    );
    textfmt_arglist_codemirror_editor.setSize('100%', '100%');
});

function generate_line(format, args)
{
    let res = format;
    for(let i = 0; i < args.length; ++i)
    {
        res = res.replace('%' + (i + 1), args[i]);
    }
    return res;
}

function do_fmt_generate()
{
    let format = textfmt_format_codemirror_editor.getValue('\n');
    let arglist = textfmt_arglist_codemirror_editor.getValue('\n');
    if(document.getElementById('fmt-js-code').checked)
    {
        try
        {
            let l = [];
            let al = eval(arglist);
            al.forEach(args =>
                {
                    l.push(generate_line(format, args));
                });
            set(l.join('\n'));
        }
        catch(e)
        {
            set(new String(e));
        }
    }
    else
    {
        try
        {
            let l = [];
            let al = arglist.split('\n');
            al.forEach(args =>
                {
                    l.push(generate_line(format, args.split(' ')));
                });
            set(l.join('\n'));
        }
        catch(e)
        {
            set(new String(e));
        }
    }
}