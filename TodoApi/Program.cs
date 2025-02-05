
using Microsoft.EntityFrameworkCore;

using TodoApi;

var builder = WebApplication.CreateBuilder(args);


var connectionString = builder.Configuration.GetConnectionString("ToDoDB");
Console.WriteLine($"Connection String: {connectionString}");
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 34))));


// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         policy.AllowAnyOrigin()         
//               .AllowAnyMethod()          
//               .AllowAnyHeader();         
//     });
// });

builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
{
    
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); }

));



var app = builder.Build();

app.UseCors("MyPolicy");


app.MapGet("/",  (ToDoDbContext db) =>
     "Hello World!");


app.MapGet("/tasks", async (ToDoDbContext db) =>
    await db.Tasks.ToListAsync());


app.MapPost("/tasks", async (ToDoDbContext db,  TodoApi.Task task) =>
{
    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    return Results.Created($"/tasks/{task.Id}", task);
});


app.MapPut("/tasks/{id}", async (ToDoDbContext db, int id,  TodoApi.Task updatedTask) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task == null) return Results.NotFound();

    //task.Name = updatedTask.Name;
    task.IsComplete = updatedTask.IsComplete;

    await db.SaveChangesAsync();
    return Results.Ok(task);
});


app.MapDelete("/tasks/{id}", async (ToDoDbContext db, int id) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task == null) return Results.NotFound();

    db.Tasks.Remove(task);
    await db.SaveChangesAsync();
    return Results.Ok();
});


app.Run();

