using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReactSignalRChat.Hubs
{
    public class MessageHub : Hub
    {
        //private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();
        IMemoryCache _cache;
        public MessageHub(IMemoryCache cache)
        {
            _cache = cache;
        }
        public async Task SelectMatch(string tranId, string selectedId)
        {
            var entry = _cache.Get(tranId) as IEnumerable<PlateRead>;
            foreach (var read in entry)
            {
                if (read.TransactionId.Equals(selectedId))
                    read.Match = PlateMatch.Match;
                else
                    read.Match = PlateMatch.Unmatch;
            }
            await Task.FromResult(0);
        }

        //public async Task SetUser(string user)
        //{
        //    _connections.Add(user, Context.ConnectionId);
        //    await Task.FromResult(true);
        //}


        //public override Task OnConnectedAsync()
        //{
        //    string name = Context?.User?.Identity?.Name;
        //    if (!string.IsNullOrEmpty(name))
        //        _connections.Add(name, Context.ConnectionId);

        //    return base.OnConnectedAsync();
        //}

        //public override Task OnDisconnectedAsync(Exception exception)
        //{
        //    //string name = Context.User.Identity.Name;

        //    //_connections.Remove(name, Context.ConnectionId);

        //    return base.OnDisconnectedAsync(exception);
        //}
    }
}