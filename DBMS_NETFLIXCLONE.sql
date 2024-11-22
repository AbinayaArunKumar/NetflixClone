-- Create the database
CREATE DATABASE netflixclone;

-- Use the database
USE netflixclone;

-- Create Users table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Role ENUM('Admin', 'User') DEFAULT 'User',
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Genres table
CREATE TABLE Genres (
    GenreID INT AUTO_INCREMENT PRIMARY KEY,
    GenreName VARCHAR(50) NOT NULL UNIQUE
);

-- Create Categories table
CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL UNIQUE
);

-- Create Directors table
CREATE TABLE Directors (
    DirectorID INT AUTO_INCREMENT PRIMARY KEY,
    DirectorName VARCHAR(100) NOT NULL,
    BirthDate DATE
);

-- Create Actors table
CREATE TABLE Actors (
    ActorID INT AUTO_INCREMENT PRIMARY KEY,
    ActorName VARCHAR(100) NOT NULL,
    DateOfBirth DATE
);

-- Create Movies table
CREATE TABLE Movies (
    MovieID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    ReleaseDate DATE,
    Rating DECIMAL(2,1) CHECK (Rating >= 0 AND Rating <= 10),
    Description TEXT,
    GenreID INT,
    DirectorID INT,
    FOREIGN KEY (GenreID) REFERENCES Genres(GenreID) ON DELETE SET NULL,
    FOREIGN KEY (DirectorID) REFERENCES Directors(DirectorID) ON DELETE SET NULL
);

-- Create Movies_Categories table (for many-to-many relationship)
CREATE TABLE Movies_Categories (
    MovieID INT,
    CategoryID INT,
    PRIMARY KEY (MovieID, CategoryID),
    FOREIGN KEY (MovieID) REFERENCES Movies(MovieID) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
);

-- Create Movies_Actors table (for many-to-many relationship)
CREATE TABLE Movies_Actors (
    MovieID INT,
    ActorID INT,
    PRIMARY KEY (MovieID, ActorID),
    FOREIGN KEY (MovieID) REFERENCES Movies(MovieID) ON DELETE CASCADE,
    FOREIGN KEY (ActorID) REFERENCES Actors(ActorID) ON DELETE CASCADE
);
-- Create Movies_genres table (for many-to-many relationship)
CREATE TABLE movies_genres (
    MovieID INT NOT NULL,
    GenreID INT NOT NULL,
    PRIMARY KEY (MovieID, GenreID),
    FOREIGN KEY (MovieID) REFERENCES movies(MovieID) ON DELETE CASCADE,
    FOREIGN KEY (GenreID) REFERENCES genres(GenreID) ON DELETE CASCADE
);

CREATE TABLE watchlists (
    WatchlistID INT NOT NULL AUTO_INCREMENT,
    UserID INT,
    MovieID INT,
    DateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (WatchlistID),
    UNIQUE (UserID, MovieID), 
    FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (MovieID) REFERENCES movies(MovieID) ON DELETE CASCADE
);
CREATE TABLE subscriptions (
    SubscriptionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    SubscriptionType ENUM('Basic', 'Standard', 'Premium') NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE
);


-- Add VideoLink field to Movies table
ALTER TABLE Movies
ADD VideoLink VARCHAR(255);

ALTER TABLE Watchlists
ADD CONSTRAINT fk_user FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
ADD CONSTRAINT fk_movie FOREIGN KEY (MovieID) REFERENCES Movies(MovieID) ON DELETE CASCADE;

ALTER TABLE watchlists
ADD UNIQUE (UserID, MovieID);

-- Function to retrieve the video link from the movies tables in the database
DELIMITER //
DROP FUNCTION IF EXISTS GetVideoLink;
CREATE FUNCTION GetVideoLink(movie_title VARCHAR(255))
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    DECLARE video_link VARCHAR(255);

    
    SELECT VideoLink INTO video_link
    FROM Movies
    WHERE TRIM(LOWER(Title)) = TRIM(LOWER(movie_title))
    LIMIT 1; -- Get the first match, if any

    RETURN video_link; 
END //

DELIMITER ;

-- Trigger that checks before insert whether the movie is present in the users watchlist already based on userid and movieid
DELIMITER $$

CREATE TRIGGER before_watchlist_insert
BEFORE INSERT ON watchlists
FOR EACH ROW
BEGIN
    -- Check if the movie already exists in the user's watchlist
    IF EXISTS (SELECT 1 FROM watchlists WHERE UserID = NEW.UserID AND MovieID = NEW.MovieID) THEN
        -- If the movie is already in the watchlist, raise an error
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Movie already exists in watchlist';
    END IF;
END$$

DELIMITER ;

-- Function to remove the movie from the watchlist when the user clicks on the delete button
DELIMITER $$


DROP FUNCTION IF EXISTS RemoveMovieFromWatchlist$$


CREATE FUNCTION RemoveMovieFromWatchlist(user_id INT, movie_id INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DELETE FROM watchlists WHERE UserID = user_id AND MovieID = movie_id;

    
    RETURN ROW_COUNT() > 0;
END$$

DELIMITER ;

-- Procedures to add , edit , and delete a movie from the database
DELIMITER $$

CREATE PROCEDURE AddNewMovie(
    IN p_title VARCHAR(255),
    IN p_releaseDate DATE,
    IN p_rating DECIMAL(2,1),
    IN p_description TEXT,
    IN p_genreId INT,
    IN p_directorId INT,
    IN p_videoLink VARCHAR(255)
)
BEGIN
    INSERT INTO Movies (Title, ReleaseDate, Rating, Description, GenreID, DirectorID, VideoLink)
    VALUES (p_title, p_releaseDate, p_rating, p_description, p_genreId, p_directorId, p_videoLink);
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UpdateMovie(
    IN p_movieId INT,
    IN p_title VARCHAR(255),
    IN p_releaseDate DATE,
    IN p_rating DECIMAL(2,1),
    IN p_description TEXT,
    IN p_genreId INT,
    IN p_directorId INT,
    IN p_videoLink VARCHAR(255)
)
BEGIN
    UPDATE Movies
    SET Title = p_title,
        ReleaseDate = p_releaseDate,
        Rating = p_rating,
        Description = p_description,
        GenreID = p_genreId,
        DirectorID = p_directorId,
        VideoLink = p_videoLink
    WHERE MovieID = p_movieId;
END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE DeleteMovie(
    IN p_movieId INT
)
BEGIN
    DELETE FROM Movies WHERE MovieID = p_movieId;
END $$

DELIMITER ;

-- Procedures to add , edit and delete genres from the database
DELIMITER $$

CREATE PROCEDURE createGenre(IN genreName VARCHAR(255))
BEGIN
    IF genreName IS NULL OR genreName = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Genre name is required';
    ELSE
        INSERT INTO Genres (GenreName) VALUES (genreName);
    END IF;
END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE updateGenre(IN genreID INT, IN genreName VARCHAR(255))
BEGIN
    IF genreName IS NULL OR genreName = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Genre name is required';
    ELSE
        UPDATE Genres
        SET GenreName = genreName
        WHERE GenreID = genreID;
        
        IF ROW_COUNT() = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Genre not found';
        END IF;
    END IF;
END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE deleteGenre(IN genreID INT)
BEGIN
    DELETE FROM Genres WHERE GenreID = genreID;
    
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Genre not found';
    END IF;
END $$

DELIMITER ;

-- Procedures to retrieve the actors from the database to display , add , edit and delete actors from the database
DELIMITER $$

CREATE PROCEDURE GetAllActors()
BEGIN
    SELECT * FROM Actors;
END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE CreateActor(IN actorName VARCHAR(255))
BEGIN
    INSERT INTO Actors (ActorName) 
    VALUES (actorName);
    
    
    SELECT LAST_INSERT_ID() AS ActorID;
END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE UpdateActor(IN actorID INT, IN actorName VARCHAR(255))
BEGIN
    UPDATE Actors 
    SET ActorName = actorName
    WHERE ActorID = actorID;
    
    
    SELECT ROW_COUNT() AS rowsAffected;
END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE DeleteActor(IN actorId INT)
BEGIN
    
    DECLARE actorExists INT;
    
    
    SELECT COUNT(*) INTO actorExists
    FROM Actors
    WHERE ActorID = actorId;
    
    
    IF actorExists > 0 THEN
        DELETE FROM Actors WHERE ActorID = actorId;
        SELECT 'Actor deleted successfully' AS message;
    ELSE
        SELECT 'Actor not found' AS message;
    END IF;
END $$

DELIMITER ;

-- Queries to perform basi checks and perform operations on the populated database
SELECT m.Title, m.Rating
FROM movies m
WHERE m.Rating > (SELECT AVG(Rating) FROM movies);

SELECT g.GenreName, AVG(m.Rating) AS AverageRating
FROM genres g
JOIN movies m ON g.GenreID = m.GenreID
GROUP BY g.GenreName;

SELECT g.GenreName, COUNT(m.MovieID) AS MovieCount
FROM genres g
LEFT JOIN movies m ON g.GenreID = m.GenreID
GROUP BY g.GenreName;

SELECT u.Username, AVG(m.Rating) AS AverageWatchlistRating
FROM users u
JOIN watchlists w ON u.UserID = w.UserID
JOIN movies m ON w.MovieID = m.MovieID
GROUP BY u.Username;

SELECT YEAR(m.ReleaseDate) AS ReleaseYear, COUNT(m.MovieID) AS MovieCount
FROM movies m
GROUP BY ReleaseYear;
