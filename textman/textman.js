/*
    TODO:
    Ok 1. Add line number
    Ok 2. Add undoable setting
    Ok 3. No regex when searching
    Ok 4. Put text in a line
    Ok 5. Put all text in a line
    Ok 6. Add number
    Ok 7. Trim
    Ok 8. Replace
    Ok 9. Add
    Give up 10. Auto wrap
*/

var codemirror_editor;

$(document).ready(() =>
{
    codemirror_editor = CodeMirror.fromTextArea(
        text_element(), {
            lineNumbers: true,
            matchBrackets: true,
            indentUnit: 4,
        }
    );
    codemirror_editor.setSize('100%', '100%');
    codemirror_editor.focus();
});

function text_element()
{
    return document.getElementById('text');
}

function take_focus()
{
    codemirror_editor.focus();
}

function text()
{
    return codemirror_editor.getValue('\n');
}

function lines()
{
    return text().split('\n');
}

function set(s)
{
    codemirror_editor.setValue(s);
    take_focus();
}

function insert(s)
{
    codemirror_editor.replaceSelection(s);
}

function paste()
{
    navigator.clipboard.read().then(s =>
        {
            insert(s);
        });
}

function do_copy()
{
    navigator.clipboard.writeText(text()).then(() =>
    {
    })
    .catch(e =>
    {
        console.log(e);
    });
}

function for_each_line(f)
{
    let res = new Array();
    lines().forEach(s => 
        {
            res.push(f(s));
        });
    return res;
}

function each_line(f)
{
    set(for_each_line(f).join('\n'));
}

function string_begins_with(s, t)
{
    if(typeof t == 'string') return s.startsWith(t);
    else return s.search(t) == 0;
}

function string_ends_with(s, t)
{
    if(typeof t == 'string') return s.endsWith(t);
    else
    {
        let m = s.match(t);
        if(m == null) return false;
        let last = m[m.length - 1];
        return s.endsWith(last);
    }
}

function get_trim()
{
    return parseInt($("#trim-input").val());
}

function line_manip(f)
{
    each_line(f);
}

function trim_left()
{
    let tm = get_trim();
    line_manip(s => 
        {
            let l = s.length;
            let r = '';
            if(l >= tm) r = s.substring(tm);
            return r;
        });
}

function trim_right()
{
    let tm = get_trim();
    line_manip(s => 
        {
            let l = s.length;
            let r = '';
            if(l >= tm) r = s.substring(0, l - tm);
            return r;
        });
}

function get_trim_until()
{
    return $("#trim-until-input").val();
}

function trim_until_left()
{
    let tm = get_trim_until();
    let tl = tm.length;
    line_manip(s => 
        {
            let l = s.length;
            let p = s.indexOf(tm);
            if(p == -1) return s;
            else return s.substring(p + tl);
        });
}

function trim_until_right()
{
    let tm = get_trim_until();
    line_manip(s => 
        {
            let p = s.lastIndexOf(tm);
            if(p == -1) return s;
            else return s.substring(0, p);
        });
}

function trim_whitespace_left()
{
    line_manip(s =>
        {
            return s.trimLeft();
        });
}

function trim_whitespace_right()
{
    line_manip(s =>
        {
            return s.trimRight();
        });
}

function remove_empty_lines()
{
    let l = lines();
    let a = new Array();
    l.forEach(s =>
        {
            if(s.trim().length > 0) a.push(s);
        });
    set(a.join('\n'));
}

function in_one_line()
{
    set(lines().join(''));
}

function tidy_up()
{
    let s = text(), r = '';
    for(let i = 0; i < s.length; ++i)
    {
        if(s[i] == '\n')
        {
            if(i < s.length - 1 && s[i + 1] == '\n')
            {
                r += '\n';
                ++i;
            }
        }
        else r += s[i];
    }
    set(r);
}

function checked(s)
{
    return document.getElementById(s + "-cb").checked;
}

function do_replace()
{
    let r1 = $("#replace-input-1").val();
    if(checked("replace")) r1 = RegExp(r1, "g");
    let r2 = $("#replace-input-2").val();
    let s = text();
    let rp = s.replaceAll(r1, r2);
    set(rp);
}

function get_add()
{
    return $("#add-input").val();
}

function add_str_to_left(sa)
{
    line_manip(s =>
        {
            return sa + s;
        });
}

function add_str_to_right(sa)
{
    line_manip(s =>
        {
            return s + sa;
        });
}

function add_to_left()
{
    add_str_to_left(get_add());
}

function add_to_right()
{
    add_str_to_right(get_add())
}

function get_add_number_format()
{
    return $("#add-number-input").val();
}

function get_add_number_str(fmt, i)
{
    function to_chinese_number(num)
    {
        function num_to_chinese(n)
        {
            return '零一二三四五六七八九'[n];
        }
        let strnum = num.toString();
        let units = '十百千万十百千万亿十百千';
        let result = ['@'];
        let unitno = 0;
        for(let i = strnum.length - 1; i >= 0; --i)
        {
            result.unshift(num_to_chinese(strnum[i]));
            if(i <= 0) break;
            result.unshift(units[unitno]);
            unitno++;
        }
        let r = result.join('')
                      .replace(/(零[千百十]){1,3}/g, '零')
                      .replace(/零{2,}/g, '零')
                      .replace(/零([万亿])/g, '$1')
                      .replace(/亿万/g, '亿')
                      .replace(/零*@/g, '');
        if(num < 20) return r.replaceAll('一十', '十');
        else return r;
    }
    return fmt.replaceAll('x', i.toString()).
               replaceAll('X', to_chinese_number(i));
}

function get_number_begin_at()
{
    return parseInt($("#add-number-begin-at-input").val());
}

function add_number_to_left()
{
    let fmt = get_add_number_format();
    let i = get_number_begin_at() - 1;
    line_manip(s =>
        {
            ++i;
            return get_add_number_str(fmt, i) + s;
        });
}

function add_number_to_right()
{
    let fmt = get_add_number_format();
    let i = get_number_begin_at() - 1;
    line_manip(s =>
        {
            ++i;
            return s + get_add_number_str(fmt, i);
        });
}

function get_wrap_select()
{
    return $("#wrap-select").val();
}

function get_wrap_value()
{
    return parseInt($("#wrap-input").val());
}

function wrap_chinese()
{
    let sel = get_wrap_select();
    let wv = get_wrap_value();
    if(wv <= 0) return;
    switch(sel)
    {
        case 'fixed-line-length':
        {
            let result = new Array();
            for_each_line(s =>
                {
                    let l = s.length;
                    console.log(l);
                    for(let i = 0; i < l; i += wv)
                    {
                        let p = i + wv;
                        console.log(l, i, p);
                        if(p >= l)
                        {
                            result.push(s.substring(i));
                            break;
                        }
                        result.push(s.substring(i, p));
                    }
                });
            set(result.join('\n'));
            break;
        }
        case 'fixed-line-count':
        {
            let s = lines().join('');
            let c = Math.ceil(s.length / wv);
            let result = new Array();
            let i = 0;
            while(i < s.length)
            {
                let j = Math.min(s.length, i + c);
                result.push(s.substring(i, j));
                i += c;
            }
            set(result.join('\n'))
            break;
        }
        default:
            break;
    }
}

function get_rlibw_value()
{
    return $("#rlibw-input").val();
}

function rlibw()
{
    let v = get_rlibw_value();
    if(checked("rlibw")) v = RegExp(v, "g");
    let r = new Array();
    let func = ($("#rlibw-select-2").val() == 'b') ? string_begins_with : string_ends_with;
    let bl = ($("#rlibw-select-1").val() == 'retain');
    for_each_line(s =>
        {
            if(func(s, v) == bl)
                r.push(s);
        });
    set(r.join('\n'));
}

function get_extract_re()
{
    return $("#extract-input").val();
}

function extract_re()
{
    let re = RegExp(get_extract_re(), "g");
    set(text().match(re).join('\n'));
}

function add_text_if_line_xxx()
{
    let to_add = eval($("#atilx-input-1").val());
    let b_e = $("#atilx-select-1").val();
    let pattern = $("#atilx-input-2").val();
    let a_b = $("#atilx-select-2").val();
    if(checked("atilx")) pattern = RegExp(pattern, "g");
    let res = new Array();
    let sat = null;
    switch(b_e)
    {
        case 'b':
        {
            sat = (s => string_begins_with(s, pattern));
            break;
        }
        case 'e':
        {
            sat = (s => string_ends_with(s, pattern));
            break;
        }
        default:
            break;
    };
    for_each_line(s =>
        {
            if(sat(s))
            {
                if(a_b == 'after') s = s + to_add;
                else s = to_add + s;
            }
            res.push(s);
        });
    alert(res);
    set(res.join('\n'));
}