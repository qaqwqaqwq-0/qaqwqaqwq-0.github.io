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

function fmt_get_delim()
{
    return eval($("#fmt-delimiter-input").val());
}

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
        delim = fmt_get_delim();
    }
    catch(e)
    {
        set(e.toString());
        return;
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

function fmt_set_arglist(s)
{
    textfmt_arglist_codemirror_editor.setValue(s.toString());
}

function do_fmt_split()
{
    let delim = null;
    try
    {
        delim = fmt_get_delim();
    }
    catch(e)
    {
        set(e.toString());
        return;
    }
    if(document.getElementById('fmt-js-code').checked)
    {
        try
        {
            let l = '[\n';
            let w = lines();
            for(let p = 0; p < w.length; ++p)
            {
                if(p != 0) l += ',\n';
                l += '    [';
                let u = w[p].split(delim);
                for(let i = 0; i < u.length; ++i)
                {
                    if(i != 0) l += ', ';
                    l += "'" + u[i] + "'";
                }
                l += ']';
            }
            l += '\n]';
            fmt_set_arglist(l);
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
            let l = for_each_line(s =>
                {
                    return s.split(delim).join(' ');
                });
            fmt_set_arglist(l.join('\n'));
        }
        catch(e)
        {
            set(e.toString());
        }
    }
}