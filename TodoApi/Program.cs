
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization(); 
var connectionString = Environment.GetEnvironmentVariable("ToDoDB");

//var connectionString = "server=b5i9vdc3izcuxg6fgipl-mysql.services.clever-cloud.com;user=ulblsgnen1gukaiv;password=NO2pbgu7xQWM1ZWDFawx;database=b5i9vdc3izcuxg6fgipl";

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("The database connection string is not set.");
}

Console.WriteLine($"Connection String: {connectionString}");


builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 34))));
    
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
{
    
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); }

));

var app = builder.Build();

app.UseCors("MyPolicy");
app.UseAuthentication();

app.UseAuthorization();

app.MapGet("/",  (ToDoDbContext db) =>
     "Hello World!");



app.MapGet("/tasks", async (ToDoDbContext db) =>
    await db.Tasks.ToListAsync()).RequireAuthorization();


app.MapPost("/tasks", async (ToDoDbContext db,  TodoApi.Task task) =>
{
    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    return Results.Created($"/tasks/{task.Id}", task);
}).RequireAuthorization();


app.MapPut("/tasks/{id}", async (ToDoDbContext db, int id,  TodoApi.Task updatedTask) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task == null) return Results.NotFound();

    task.IsComplete = updatedTask.IsComplete;

    await db.SaveChangesAsync();
    return Results.Ok(task);
}).RequireAuthorization();


app.MapDelete("/tasks/{id}", async (ToDoDbContext db, int id) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task == null) return Results.NotFound();

    db.Tasks.Remove(task);
    await db.SaveChangesAsync();
    return Results.Ok();
}).RequireAuthorization();
 app.MapGet("/users", async (ToDoDbContext db) =>
                await db.Users.ToListAsync());


app.MapAuthEndpoints();

app.Run();

