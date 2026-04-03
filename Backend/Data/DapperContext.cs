using System.Data;
using Npgsql;

namespace aborginal_art_gallery.Data;

public class DapperContext
{
    private readonly IConfiguration _config;
    private readonly string _connectionString;
    public DapperContext(IConfiguration config)
    {
        _config = config;
        _connectionString = _config.GetConnectionString("DefaultConnection") ?? "";
    }
    public IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);
}