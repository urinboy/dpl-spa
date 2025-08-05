<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('key', 200); // Tarjima kaliti (home.welcome, menu.products)
            $table->text('value'); // Tarjima qiymati
            $table->foreignId('language_id')->constrained()->onDelete('cascade'); // Qaysi tilga
            $table->string('group', 50)->nullable(); // Guruh (general, menu, products)
            $table->timestamps();

            // Indekslar
            $table->index(['key', 'language_id']);
            $table->index('group');
            $table->unique(['key', 'language_id']); // Bir kalitga bir tilda bitta tarjima
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('translations');
    }
}
