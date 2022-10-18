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
    for(let i = args.length; i >= 0; --i)
        // becuase %1 is a prefix of %10
    {
        res = res.replaceAll('%' + (i + 1), args[i]);
    }
    return res;
}

function do_fmt_generate()
{
    let delim = null;
    try
    {
        delim = eval($("#fmt-delimiter-input").val());
    }
    catch(e)
    {
        delim = e.toString();
    }
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
            set(l.join(delim));
        }
        catch(e)
        {
            set(e.toString());
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
                    l.push(generate_line(format, args.split(/\s+/g)));
                });
            set(l.join(delim));
        }
        catch(e)
        {
            set(e.toString());
        }
    }
}