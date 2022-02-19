var CountAPI =
{
    keys:
    [
        "visits",
        "zhpd",
        "wot"
    ],
    create: function(t)
    {
        let url = 'https://api.countapi.xyz/create?namespace=qaqwqaqwq-0.github.io&key=' + t + '&value=0&enable_reset=1&update_lowerbound=-1000000&update_upperbound=1000000';
        return $.getJSON(url);
    },
    hit: function(t)
    {
        let url = 'https://api.countapi.xyz/hit/qaqwqaqwq-0.github.io/' + t;
        return $.getJSON(url);
    },
    set: function(t, v)
    {
        let url = 'https://api.countapi.xyz/set/qaqwqaqwq-0.github.io/' + t + '?value=' + v;
        return $.getJSON(url);
    },
    update: function(t, v)
    {
        let url = 'https://api.countapi.xyz/update/qaqwqaqwq-0.github.io/' + t + '?amount=' + v;
        return $.getJSON(url);
    },
    get: function(t)
    {
        let url = 'https://api.countapi.xyz/get/qaqwqaqwq-0.github.io/' + t;
        return $.getJSON(url);
    }
};

function zhpd()
{
    CountAPI.hit('zhpd');
}

function wot()
{
    CountAPI.hit('wot');
}