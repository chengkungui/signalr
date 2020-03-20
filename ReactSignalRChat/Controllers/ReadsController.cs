using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Linq;
using ReactSignalRChat.Hubs;

namespace ReactSignalRChat.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ReadsController : ControllerBase
    {
        private IHubContext<MessageHub> _hub;
        private IMemoryCache _cache;
        public ReadsController(IHubContext<MessageHub> hubContext, IMemoryCache memoryCache) :base()
        {
            this._hub = hubContext;
            _cache = memoryCache;
        }
         
        [HttpPost("{id}")]
        public Task SetPossibleMatches(string id, [FromBody] IEnumerable<PlateRead> reads)
        {
            _cache.Set(id, reads, new MemoryCacheEntryOptions() { AbsoluteExpirationRelativeToNow = new TimeSpan(0, 3, 0) , Size = 1});
            _hub.Clients.All.SendAsync("ReceiveMessage", id);
            return Task.FromResult(0);
        }

        [HttpPost("{id}")]
        public Task SetMatch(string id, [FromBody] PlateRead read)
        {
            var entry = _cache.Get(id) as IEnumerable<PlateRead>;
            foreach (var r in entry)
            {
                if (r.TransactionId.Equals(read.TransactionId))
                    r.Match = PlateMatch.Match;
                else
                    r.Match = PlateMatch.Unmatch;
            }
            return Task.FromResult(entry);
        }


        [HttpGet("{id}")]
        public Task<IEnumerable<PlateRead>> GetPossibleMatches([FromRoute]string id)
        {
            IEnumerable<PlateRead> reads;
            if (_cache.TryGetValue(id, out reads))
                return Task.FromResult(reads);
            return Task.FromResult(new List<PlateRead>().AsEnumerable());
        }

        [HttpGet("{id}")]
        public Task<MatchResult> GetMatch(string id)
        {

            var entry = _cache.Get(id) as IEnumerable<PlateRead>;
            var match = entry.FirstOrDefault(r => r.Match == PlateMatch.Match);
            var result = new MatchResult();
            if (match != null)
            {
                result.Selected = true;
                result.MatchId = match.TransactionId;
            }
            else
            {
                result.MatchId = Guid.Empty;
                result.Selected = entry.Any(r => r.Match == PlateMatch.Unmatch);
            }
            return Task.FromResult(result);
        }

        public class MatchResult
        {
            public bool Selected { get; set; }
            public Guid MatchId { get; set; }
        }

    }
}