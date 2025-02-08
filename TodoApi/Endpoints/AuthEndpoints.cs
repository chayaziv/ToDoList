using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi;
public class LoginModel
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}


public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {

        app.MapGet("/auth", (ToDoDbContext db) => "Hello auth!");

        app.MapPost("/login", async ([FromBody] LoginModel loginModel, ToDoDbContext db,IConfiguration config) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == loginModel.Username && u.Password == loginModel.Password);
            if (user is null)
                return Results.Unauthorized();

            var jwt = CreateJWT(user, config);
            return Results.Ok(new { Token = jwt });
        });
 
        app.MapPost("/register", async ([FromBody] LoginModel loginModel, ToDoDbContext db,IConfiguration config) =>
        {
            if (await db.Users.AnyAsync(u => u.Username == loginModel.Username))
                return Results.BadRequest("Username already exists");

            var newUser = new User
            {
                Username = loginModel.Username,
                Password = loginModel.Password 
            };

            db.Users.Add(newUser);
            await db.SaveChangesAsync();

            var jwt = CreateJWT(newUser, config);
            return Results.Ok(new { Token = jwt });
        });
    }

    private static string CreateJWT(User user, IConfiguration config)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            config["Jwt:Issuer"],
            config["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}


