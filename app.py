from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import mysql.connector
import logging

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.static_folder = 'sources/static'

def get_db_connection():
    cnx = mysql.connector.connect(
        user='root',
        password='$uP3rS3cr3tP@ssw0rd!',
        host='localhost',
        database='bookverse'
    )
    return cnx

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.form
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Invalid credentials'}), 401

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE email = %s AND password = %s"
        try:
            cursor.execute(query, (email, password))
            user = cursor.fetchone()
            if user:
                session['user_id'] = user['id']
                cnx.close()
                return redirect(url_for('book'))
            else:
                return jsonify({'message': 'Invalid credentials'}), 401
        except mysql.connector.Error as err:
            logging.error(f'Error: {err}')
            cnx.rollback()
            cnx.close()
            return jsonify({'message': 'Error: Internal Server Error'}), 500
    else:
        return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        full_name = data.get('full_name')
        email = data.get('email')
        password = data.get('password')

        if not full_name or not email or not password:
            return jsonify({'message': 'Invalid data'}), 400

        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = "INSERT INTO users (full_name, email, password) VALUES (%s, %s, %s)"
        try:
            cursor.execute(query, (full_name, email, password))
            cnx.commit()
            cnx.close()
            return redirect(url_for('login'))
        except mysql.connector.Error as err:
            logging.error(f'Error: {err}')
            cnx.rollback()
            cnx.close()
            return jsonify({'message': 'Error: Internal Server Error'}), 500
    else:
        return render_template('create.html')

@app.route('/book')
def book():
    return render_template('book.html')

@app.route('/book/diario')
def diario():
    return render_template('Diario.html')

@app.route('/book/reunion')
def reunion():
    return render_template('reunion.html')

@app.route('/book/viaje')
def viaje():
    return render_template('viaje.html')

@app.route('/book/tribulaciones')
def tribulaciones():
    return render_template('tribulaciones.html')

@app.route('/book/frankenstein')
def frankenstein():
    return render_template('frankenstein.html')

@app.route('/book/transformacion')
def transformacion():
    return render_template('transformacion.html')

@app.route('/book/isla')
def isla():
    return render_template('isla.html')

@app.route('/book/peor')
def peor():
    return render_template('peor.html')

@app.route('/book/luna')
def luna():
    return render_template('luna.html')

@app.route('/book/profile')
def profile():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)

    # Get user info
    cursor.execute("SELECT full_name, email FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    # Get user reviews
    cursor.execute("SELECT r.id, b.name AS book_name, r.rating, r.review FROM reviews r JOIN books b ON r.book_id = b.id WHERE r.user_id = %s", (user_id,))
    reviews = cursor.fetchall()

    cnx.close()

    return render_template('profile.html', user=user, reviews=reviews)

@app.route('/review/update/<int:review_id>', methods=['POST'])
def update_review(review_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    data = request.json
    rating = data.get('rating')
    review = data.get('review')

    cnx = get_db_connection()
    cursor = cnx.cursor()

    query = "UPDATE reviews SET rating = %s, review = %s WHERE id = %s AND user_id = %s"
    cursor.execute(query, (rating, review, review_id, session['user_id']))
    cnx.commit()
    cnx.close()

    return jsonify({'message': 'Review updated successfully'})

@app.route('/review/delete/<int:review_id>', methods=['POST'])
def delete_review(review_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    cnx = get_db_connection()
    cursor = cnx.cursor()

    query = "DELETE FROM reviews WHERE id = %s AND user_id = %s"
    cursor.execute(query, (review_id, session['user_id']))
    cnx.commit()
    cnx.close()

    return jsonify({'message': 'Review deleted successfully'})

@app.route('/book/review/add', methods=['POST'])
def add_review():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'User not logged in'})

    data = request.json
    book_id = data.get('book_id')
    rating = data.get('rating')
    review = data.get('review')

    if not book_id or not rating or not review:
        return jsonify({'success': False, 'message': 'Missing data'})

    cnx = get_db_connection()
    cursor = cnx.cursor()

    query = "INSERT INTO reviews (user_id, book_id, rating, review) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (session['user_id'], book_id, rating, review))
    cnx.commit()
    cnx.close()

    return jsonify({'success': True})

@app.route('/book/reviews/<int:book_id>')
def get_reviews(book_id):
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)

    query = """
    SELECT u.full_name, r.rating, r.review 
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.book_id = %s
    """
    cursor.execute(query, (book_id,))
    reviews = cursor.fetchall()
    cnx.close()

    return jsonify(reviews)

@app.route('/search')
def search():
    query = request.args.get('q')
    author = request.args.get('author')
    genre = request.args.get('genre')

    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)

    sql_query = "SELECT id, name, image_url FROM books WHERE 1=1"
    params = []

    if query:
        sql_query += " AND name LIKE %s"
        params.append(f"%{query}%")
    
    if author:
        sql_query += " AND author = %s"
        params.append(author)
    
    if genre:
        sql_query += " AND genre = %s"
        params.append(genre)

    cursor.execute(sql_query, params)
    books = cursor.fetchall()
    cnx.close()

    return jsonify(books)

if __name__ == '__main__':
    app.run(debug=True)
